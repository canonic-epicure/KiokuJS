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
        
        
        collapse : function (instance, node, collapser) {
            var data = {}
            
            Joose.O.eachOwn(instance, function (value, key) {

                data[ key ] = collapser.visit(value)
            })
            
            return data
        },
        
        
//        refresh : function (instance, data, linker) {
//        },
        
        
        createEmptyInstance : function (node, className) {
            return {}
        },
        
        
        expand : function (instance, node, expander) {
            
            Joose.O.each(node.data, function (value, name) {
                
                instance[ name ] = expander.visit(value)
            })
            
            return instance
        }
    }

})
