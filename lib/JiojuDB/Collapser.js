Class('JiojuDB.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes
        
        compact             : true,
        
        resolver            : { required : true }
        
//        ,
//        
//        liveObjects         : { required : true }
    },
    
        
//    after : {
//        
//    },
    
    
    before : {
        markSeen    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        },
        
        visitSeen : function (object) {
            this.refCounts[ object.__REFADR__ ]++
        }
    },
    
    
    methods : {
        
        collapse : function () {
            if (!arguments.length) throw "Invalid arguments to 'collapse'"
            
            Joose.A.each(arguments, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
            })
            
            
            this.visit.apply(this, arguments)
            
            
            var nodes       = this.nodes
            
            Joose.A.each(arguments, function (argument) {
                nodes[ argument.__REFADR__ ].firstClass = true
            })
            
            
            var firstClassNodes     = []
            var refCounts           = this.refCounts
            
            Joose.O.each(nodes, function (node, refadr) {

                if ( (refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.typeMap.intrinsic || !this.compact) {
                    node.firstClass = true
                    
                    firstClassNodes.push(node)
                }
            }, this)
            
            return firstClassNodes
        },
     
        
        cleanUp : function () {
            // naive attempt to help to GC
            delete this.refCounts
            delete this.nodes
            delete this.seen
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
            
            return this.createNode(instance, data, typeMap)
        },
        
        
        createNode : function (object, data) {
            
            return this.nodes[ object.__REFADR__ ] = new JiojuDB.Reference({
                object      : object,
                data        : data,
                typeMap     : typeMap
            })
        }
        
//        ,
//        
//        
//        createEntry : function (node) {
//            var object  = node.object
//            
//            return new JiojuDB.Entry({
//                data            : node.data,
//                className       : this.getClassNameFor(object),
//                traits          : null, // XXX
//                classVersion    : null  // XXX
//            })            
//        }
    }

})


