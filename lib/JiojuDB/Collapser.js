Class('JiojuDB.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes
        
        compact             : true,
        
        resolver            : { required : true },
        
        liveObjects         : { required : true }
    },
    
        
    
    before : {
        
        markSeen    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        },
        
        
        visitSeen : function (object) {
            this.refCounts[ object.__REFADR__ ]++
        }
    },
    
    
    methods : {
        
        // calls `func` with (object, desiredID) signature for each passed argument
        eachArgument : function (objectWithIds, objectsWithOutIDs, func, scope) {
            Joose.O.each(objectWithIds      || {}, func, scope || this)
            
            Joose.A.each(objectsWithOutIDs  || [], function (argument) {
                
                func.call(scope || this, argument)
            })
        },
        
        
        collapse : function (objectWithIds, objectsWithOutIDs) {
            // sanity checks 
            
            var objectsCounter = 0
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
                
                objectsCounter++
            })
            
            if (!objectsCounter) throw "Invalid arguments to 'collapse' - no objects to collapse"

            
            // recurse through the graph, accumulating nodes and counting refs
            
            this.visit.apply(this, [ objectWithIds, objectsWithOutIDs ])
            

            // assume all passed objects are first class, so we need to acquire IDs for them
            
            var nodes               = this.nodes
            var firstClassNodes     = []
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument, desiredId) {
                nodes[ argument.__REFADR__ ].acquireID(desiredId)
                
                firstClassNodes.push(node)
            })


            // also marks shared nodes (refCount > 1) and Joose instances (unless intrinsic) as first class (if we are in compact mode) 
            
            var refCounts           = this.refCounts
            
            Joose.O.each(nodes, function (node, refadr) {

                if ( (refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.typeMap.intrinsic || !this.compact) {
                    // this makes this node firstClass thing
                    node.acquireID()
                    
                    firstClassNodes.push(node)
                }
            }, this)
            

            // extracting entry from each first-class node
            
            var liveObjects         = this.liveObjects
            
            return Joose.A.map(firstClassNodes, function (node) {
                    
                var entry = node.getEntry()
                
                liveObjects.save(entry)
                
                return entry
            })
        },
     
        
        getTypeMapFor : function (className) {
            var typeMap = this.resolver.resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
        },
        
        
        visitArray : function (instance, className) {
            return this.visitObject(instance, className)
        },
        
        
        visitObject : function (instance, className) {
            var typeMap         = this.getTypeMapFor(className)
            
            var data = typeMap.collapse(instance, this)
            
            return this.createNode(instance, data, typeMap, className)
        },
        
        
        createNode : function (object, data, typeMap, className) {
            
            return this.nodes[ object.__REFADR__ ] = new JiojuDB.Node({
                object      : object,
                className   : className,
                
                data        : data,
                typeMap     : typeMap
            })
        }
    }

})


