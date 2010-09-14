Class('KiokuJS.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes, addressed by __REFADR__
        
        backend             : null,
        scope               : { required : true },
        
        isShallow           : false,
        setRoot             : true,
        
        rootObjects         : Joose.I.Object
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
        
        
        visitSeen : function (object, seen) {
            var refAdr = object.__REFADR__
            
            this.refCounts[ refAdr ]++
            
            // return either the node from `this.nodes` - for nodes being collapsed
            // or "seen" node - for nodes which are skipped during shallow collapsing
            return this.nodes[ refAdr ] || seen
        },
        
        
        // calls `func` with (object, desiredID) signature for each passed argument
        eachArgument : function (wIDs, woIDs, func, scope) {
            scope = scope || this
            
            Joose.O.each(wIDs, func, scope)
            
            Joose.A.each(woIDs, function (argument) {
                func.call(scope, argument)
            })
        },
        
        
        collapse : function (wIDs, woIDs) {
            
            // sanity checks
            
            this.eachArgument(wIDs, woIDs, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
                
                var refAdr = this.assignRefAdrTo(argument)
                
                this.rootObjects[ refAdr ] = true
            })
            
            
            // recurse through the graph, accumulating nodes and counting refs
            
            this.visit(wIDs, woIDs)
            

            // all objects are from root set, so we need to acquire IDs for them
            
            var nodes               = this.nodes
            
            this.eachArgument(wIDs, woIDs, function (argument, desiredId) {
                var node = nodes[ argument.__REFADR__ ]
                
                node.acquireID(desiredId)
                if (this.setRoot) node.isRoot = true
            })


            // also marks shared nodes (refCount > 1) and Joose instances (unless intrinsic) as first class 
            
            var refCounts           = this.refCounts
            var firstClassNodes     = []
            var me                  = this
            
            Joose.O.each(nodes, function (node, refadr) {
                
                var object      = node.object
                var isShared    = refCounts[ refadr ] > 1 || Joose.O.isInstance(object)
                
                if ( me.belongsToRootSet(object) || isShared && !node.isIntrinsic() ) {
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
        
        
        belongsToRootSet : function (object) {
            return this.rootObjects[ object.__REFADR__ ]
        },
        
        
        visitObject : function (instance, className) {
            var scope           = this.scope
            var nodes           = this.nodes
            
            var node            = scope.objectToNode(instance)
            var refAdr          = instance.__REFADR__
            
            // if this is a shallow collapsing, and we found the instance which already has the node
            // then stop collapsing at this point and do not recurse
            // also do not add the node into `this.nodes` to prevent it from returning as a result of `collapse`
            if (node && (this.isShallow && !this.belongsToRootSet(instance) || node.immutable)) return node
                
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


