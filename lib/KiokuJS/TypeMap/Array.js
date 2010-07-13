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
        
        
//        refresh : function (instance, data, linker) {
//        },
        
        
        createEmptyInstance : function (node, className) {
            return []
        },
        
        
        populate : function (instance, node, expander) {
            Joose.A.map(node.data, function (value) {
                
                instance.push(expander.visit(value))
            })
            
            return instance
        }
    }

})
