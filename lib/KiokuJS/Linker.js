Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    use     : 'KiokuJS.Linker.Expander',
    
    
    has : {
        scope           : { required : true }
    },
    
        
    methods : {
        
        animateNodes : function () {
            var scope = this.scope
            
            KiokuJS.Linker.Expander.expandNodes(scope.getOwnNodes(), scope)
        }
    },
    
    
    continued : {
        
        methods : {
            
            materialize : function (ids) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                
                backend.get(ids).andThen(function (nodes) {
                    
                    var newNodes        = []
                    
                    // filter the nodes returned from backend to only the new ones
                    // (which don't already have corresponding object in the scope)
                    // this should allow backends to pre-fetch references (potentially
                    // with extra nodes)
                    Joose.A.each(nodes, function (node) {
                        if (!scope.nodePinned(node)) {

                            scope.pinNode(node)
                            
                            newNodes.push(node)
                        }
                    })
                    
                    
                    var notFetchedIds   = []
                    
                    Joose.A.each(backend.gatherReferences(newNodes), function (refID) {
                        if (!scope.idPinned(refID)) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds).now()
                    else
                        me.prefetchClasses(me.nodes).andThen(function () {
                            
                            me.animateNodes()
                            
                            this.CONTINUE()
                        })
                })
            },
            
            
            prefetchClasses : function (nodes) {
                // gathering classes of the nodes, which needs to be loaded
                var classDescriptors = []
                
                //XXX extract required classes from typemap instead of directly from node
                Joose.O.each(nodes, function (node, id) {
                    
                    var className = node.className
                    
                    if (className == 'Object' || className == 'Array') return
                    
                    if (node.classVersion) 
                        classDescriptors.push({ type : 'joose', token : className, version : node.classVersion })
                    else
                        classDescriptors.push(className)
                        
                    if (node.traits) classDescriptors.push.apply(classDescriptors, node.traits)
                })
                
                use(classDescriptors, this.getCONTINUE())
            },
            
            
            link : function (ids) {
                // fetching resolver's classes (in case it has been mutated)
                this.scope.getResolver().fetchClasses().andThen(function () {
                    
                    this.materialize(ids).now()
                    
                }, this)
            }
        }
    }
    

})


