Class('JiojuDB.Node', {
    
    has : {
        
        ID          : null,
        
//        REFADR      : null,
        
        object      : { required    : true },
        
        typeMap     : { required    : true },
        
        data        : { required    : true },
        
        firstClass  : false
    },
    
    
//    
//    
//    after : {
//        initialize : function () {
//            this.REFADR = object.__REFADR__
//        }
//    }

    methods : {
        
        clone   : function (id) {
            if (this.firstClass) throw "Can't clone first class node"
            
            var config = {
                object      : this.object,
                typeMap     : this.typeMap,
                data        : this.typeMap,
                firstClass  : false
            }
            
            if (id) config.ID = id
            
            return new this.constructor(config)
        }
        
    }
    
})