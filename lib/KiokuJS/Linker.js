Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    use     : 'KiokuJS.Linker.Expander',
    
    
    has : {
        scope           : { 
            required        : true,
            handles         : 'decodeEntries'
        },
        
        entries         : Joose.I.Object,
        
        nodes           : {
            lazy    : function () {
                return this.decodeEntries(this.entries)
            }
        }
    },
    

    methods : {
        
        BUILD : function (config) {
            var entries = config.entries
            
            if (entries instanceof Array) {
                var entriesByID = {}
                
                Joose.A.each(entries, function (entry) {
                    entriesByID[ entry.ID ] = entry
                })
                
                config.entries = entriesByID
            }
            
            return config
        },
        
        
        animateNodes : function () {
            var scope   = this.scope
            var nodes   = this.getNodes()
            
            KiokuJS.Linker.Expander.expandNodes(nodes, this.scope)
            
            Joose.O.each(nodes, function (node, id) {
                
                if (node.isFirstClass()) scope.pinNode(node)
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            materialize : function (ids, shallowLevel) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                
                var idsToFetch  = []
                
                Joose.A.each(ids, function (id) {
                    if (!scope.idPinned(id) || shallowLevel > 0) idsToFetch.push(id)
                })
                

                backend.get(idsToFetch, scope).andThen(function (entries) {
                    
                    var newEntries        = []
                    
                    // filter the entries returned from backend to only the new ones
                    // (which don't already have corresponding object in the scope)
                    // this should allow backends to pre-fetch references (potentially
                    // with extra entries)
                    Joose.A.each(entries, function (entry) {
                        
                        var entryID      = entry.ID
                        
                        // some entry was returned repeatedly
                        if (me.entries[ entryID ]) return
                        
                        if (!scope.idPinned(entryID) || shallowLevel > 0) {

                            me.entries[ entryID ] = entry
                            
                            newEntries.push(entry)
                        }
                    })
                    
                    var notFetchedIds   = []
                    
                    Joose.A.each(scope.gatherReferences(newEntries), function (refID) {
                        if (me.entries[ refID ]) return
                        
                        if (!scope.idPinned(refID) || shallowLevel == 2) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds, shallowLevel == 2 ? 2 : 0).now()
                    else 
                        me.prefetchClasses(me.getNodes()).andThen(function () {
                            
                            me.animateNodes()
                            
                            this.CONTINUE()
                        })
                })
            },
            
            
            prefetchClasses : function (nodes) {
                // gathering classes of the nodes, which needs to be loaded
                var classDescriptors = []
                
                //XXX extract required classes from typemap instead of directly from node (node.getRequiredClasses())
                Joose.O.each(nodes, function (node, id) {
                    
                    var className = node.className
                    
                    if (className == 'Object' || className == 'Array') return
                    
                    if (node.classVersion) 
                        classDescriptors.push({ type : 'joose', token : className, version : node.classVersion })
                    else
                        classDescriptors.push(className)
                        
                    if (node.objTraits) classDescriptors.push.apply(classDescriptors, node.objTraits)
                })
                
                use(classDescriptors, this.getCONTINUE())
            },
            
            
            link : function (ids, shallowLevel) {
                // fetching resolver's classes (in case it has been mutated)
                this.scope.getResolver().fetchClasses().andThen(function () {
                    
                    this.materialize(ids, shallowLevel).now()
                    
                }, this)
            }
        }
    }
    

})


