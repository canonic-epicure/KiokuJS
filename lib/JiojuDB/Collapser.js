Class('JiojuDB.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes
        
        resolver            : { required : true }
        
//        ,
//        
//        liveObjects         : { required : true }
    },
    
        
    after : {
        
        markSeen    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        }
    },
    
    
    before : {
        
        visitSeen : function (object) {
            this.refCounts[ object.__REFADR__ ]++
        }
    },
    
    
    methods : {
        
        collapse : function () {
            if (!arguments.length) return
            
            this.visit.apply(this, arguments)
            
            
            var nodes       = this.nodes
            var refCounts   = this.refCounts
            
            Joose.A.each(arguments, function (argument) {
                nodes[ argument.__REFADR__ ].firstClass = true
            })
            
            Joose.O.each(nodes, function (node, refadr) {
                if ( (refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.typeMap.intrinsic) node.firstClass = true
            })
        },
        
        
        getEntries : function () {
            var entries = []
            
            Joose.O.each(this.nodes, function (node, refadr) {
                
                
                
            }, this)
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
    }

})


