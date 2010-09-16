Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    use     : 'KiokuJS.Linker.Expander',
    
    
    has : {
        scope           : { required : true },
        
        nodes           : Joose.I.Object
    },
    

    methods : {
        
        animateNodes : function () {
            var scope = this.scope
            
            KiokuJS.Linker.Expander.expandNodes(this.nodes, this.scope)
            
            Joose.O.each(this.nodes, function (node, id) {
                
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
                

                backend.get(ids, scope).andThen(function (nodes) {
                    
                    var newNodes        = []
                    
                    // filter the nodes returned from backend to only the new ones
                    // (which don't already have corresponding object in the scope)
                    // this should allow backends to pre-fetch references (potentially
                    // with extra nodes)
                    Joose.A.each(nodes, function (node) {
                        
                        var nodeID      = node.ID
                        
                        // some node was returned repeatedly
                        if (me.nodes[ nodeID ]) return
                        
                        
                        var oldNode = scope.idToNode(nodeID)
                        
                        if (!oldNode || shallowLevel >= 1) {

                            me.nodes[ nodeID ] = node
                            
                            newNodes.push(node)
                            
                            if (oldNode) node.consumeOldNode(oldNode)
                        }
                    })
                    
                    
                    var notFetchedIds   = []
                    
                    Joose.A.each(backend.gatherReferences(newNodes), function (refID) {
                        if (me.nodes[ refID ]) return
                        
                        if (!scope.idPinned(refID) || shallowLevel == 2) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds, shallowLevel == 2 ? 2 : 0).now()
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
                
                //XXX extract required classes from typemap instead of directly from node (node.getRequiredClasses())
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
            
            
            link : function (ids, shallowLevel) {
                // fetching resolver's classes (in case it has been mutated)
                this.scope.getResolver().fetchClasses().andThen(function () {
                    
                    this.materialize(ids, shallowLevel).now()
                    
                }, this)
            }
        }
    }
    

})


