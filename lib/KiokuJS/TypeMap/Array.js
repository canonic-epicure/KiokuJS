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
        
        
        collapse : function (instance, node, collapser) {
            node.data = Joose.A.map(instance, function (value) {
                
                return collapser.visit(value)
            })
        },
        
        
//        refresh : function (instance, data, linker) {
//        },
        
        
        expand : function (node, expander) {
            var instance = []
            
            if (node.isFirstClass()) expander.pinObject(instance, node.ID)
            
            Joose.A.map(node.data, function (value) {
                
                instance.push(expander.visit(value))
            })
            
            return instance
        }
    }

})
