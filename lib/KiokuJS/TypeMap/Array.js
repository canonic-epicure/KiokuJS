Class('KiokuJS.TypeMap.Array', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Array',
        isNative    : true
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Array'
        },
        
        
        collapse : function (instance, node, collapser) {
            return Joose.A.map(instance, function (value) {
                return collapser.visit(value)
            })
        },

        
//        refresh : function (instance, data, linker) {
//        },
        
        
        createEmptyInstance : function (node) {
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
