Class('JiojuDB.TypeMap.Object', {
    
    isa     : 'JiojuDB.TypeMap',
    
    
    
    has : {
        forClass    : 'Array'
    },
    
        
    methods : {
        
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
