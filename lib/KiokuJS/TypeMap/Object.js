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
        
        
        collapse : function (node, collapser) {
            var data = {}
            
            Joose.O.eachOwn(node.object, function (value, name) {
                data[ name ] = collapser.visit(value)
            })
            
            return data
        },
        
        
        clearInstance : function (node) {
            
            Joose.O.eachOwn(node.object, function (value, name) {
                delete instance[ name ]
            })
        },
        
        
        createEmptyInstance : function (node) {
            return {}
        },
        
        
        populate : function (node, expander) {
            var instance = node.object
            
            Joose.O.each(node.data, function (value, name) {
                
                instance[ name ] = expander.visit(value)
            })
        }
    }

})
