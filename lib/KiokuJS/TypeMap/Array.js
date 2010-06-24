Class('KiokuJS.TypeMap.Array', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
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
        
        
//        refresh : function (instance, data, linker) {
//        },
        
        
        expand : function (entry, linker) {
        }
    }

})
