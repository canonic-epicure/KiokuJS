Class('KiokuJS.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes, addressed by __REFADR__
        
        backend             : null,
        scope               : { required : true },
        
        isShallow           : false,
        
        rootSet             : Joose.I.Object
    },
    
        
    
    before : {
        
        markSeenAs    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        }
        
    },
    
    
    methods : {
        
        initialize : function () {
            this.backend = this.scope.getBackend()
        },
        
        
        visitSeen : function (object) {
            var refAdr = object.__REFADR__
            
            this.refCounts[ refAdr ]++
            
            return this.nodes[ refAdr ]
        },
        
        
        // calls `func` with (object, desiredID) signature for each passed argument
        eachArgument : function (objectsWithIDs, objectsWithOutIDs, func, scope) {
            scope = scope || this
            
            Joose.O.each(objectsWithIDs, func, scope)
            
            Joose.A.each(objectsWithOutIDs, function (argument) {
                func.call(scope, argument)
            })
        },
        
        
        collapse : function (objectsWithIDs, objectsWithOutIDs) {
            
            // sanity checks
            
            this.eachArgument(objectsWithIDs, objectsWithOutIDs, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
                
                var refAdr = this.assignRefAdrTo(argument)
                
                this.rootSet[ refAdr ] = argument
            })
            
            
            // recurse through the graph, accumulating nodes and counting refs
            
            this.visit(objectsWithIDs, objectsWithOutIDs)
            

            // all objects are from root set, so we need to acquire IDs for them
            
            var nodes               = this.nodes
            
            this.eachArgument(objectsWithIDs, objectsWithOutIDs, function (argument, desiredId) {
                var node = nodes[ argument.__REFADR__ ]
                
                node.acquireID(desiredId)
                node.isRoot = true
            })


            // also marks shared nodes (refCount > 1) and Joose instances (unless intrinsic) as first class 
            
            var refCounts           = this.refCounts
            var firstClassNodes     = []
            
            Joose.O.each(nodes, function (node, refadr) {
                
                if ( node.isRoot || (refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.isIntrinsic()) {
                    // this makes this node `firstClass` (but not root)
                    if (!node.isFirstClass()) node.acquireID()
                    
                    if (!node.immutable) firstClassNodes.push(node)
                }
            })
            
            
            return firstClassNodes
        },
     
        
        visitArray : function (instance, className) {
            return this.visitObject(instance, className)
        },
        
        
        visitObject : function (instance, className) {
            var scope           = this.scope
            var nodes           = this.nodes
            
            var node            = scope.objectToNode(instance)
            var refAdr          = instance.__REFADR__
            
            
            if (node && this.isShallow && !this.rootSet[ refAdr ])
                return new KiokuJS.Reference({
                    ID  : scope.objectToId(instance)
                })
                
            if (node) {
                node.clearEntry()
                
                nodes[ refAdr ] = node
            } else
                // need to create the node before recursing through the instance's data, to handle circular-references correctly
                nodes[ refAdr ] = node = this.backend.createNodeFromObject(instance)
            
            // now that node is already in the `this.nodes` we can collect the data
            node.collapse(this)
            
            return node
        }
    }

})


