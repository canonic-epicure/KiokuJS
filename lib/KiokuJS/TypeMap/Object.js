Class('KiokuJS.TypeMap.Object', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Object'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Object'
        },
        
        
//        refresh : function (instance, data, linker) {
//        },
        
        
        createEmptyInstance : function (node, className) {
            return {}
        },
        
        
        populate : function (instance, node, expander) {
            
            Joose.O.each(node.data, function (value, name) {
                
                instance[ name ] = expander.visit(value)
            })
            
            return instance
        }
    }

})
