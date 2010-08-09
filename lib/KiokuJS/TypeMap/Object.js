Class('KiokuJS.TypeMap.Object', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Object',
        isNative    : true
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Object'
        },
        
        
        collapse : function (instance, node, collapser) {
            var data = {}
            
            Joose.O.eachOwn(instance, function (value, name) {
                data[ name ] = collapser.visit(value)
            })
            
            return data
        },
        
        
        clear : function (instance, node) {
            Joose.O.eachOwn(instance, function (value, name) {
                
                delete instance[ name ]
            })
        },
        
        
        createEmptyInstance : function (node) {
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
