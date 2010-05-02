Class('JiojuDB.TypeMap.Array', {
    
    isa     : 'JiojuDB.TypeMap',
    
    does    : 'JiojuDB.TypeMap.Feature.NoDeps',
    
    
    has : {
        forClass    : 'Array'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Array'
        },
        
        
        collapse : function (instance, collapser) {
            return Joose.A.map(instance, function (value) {
                
                return collapser.visit(value)
            })
        },
        
        
        refresh : function (instance, data, linker) {
        },
        
        
        expand : function (data, linker) {
        }
    }

})
