Class('KiokuJS.TypeMap.Array', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Array',
        passThrough : true
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Array'
        },
        
        
        collapse : function (node, collapser) {
            
            return Joose.A.map(node.object, function (value) {
                return collapser.visit(value)
            })
        },

        
        clearInstance : function (node) {
            var instance = node.object
            
            if (instance.length) instance.splice(0, instance.length)
        },
        
        
        createEmptyInstance : function (node) {
            return []
        },
        
        
        populate : function (node, expander) {
            var instance = node.object
            
            Joose.A.map(node.data, function (value) {
                
                instance.push(expander.visit(value))
            })
        }
    }

})
