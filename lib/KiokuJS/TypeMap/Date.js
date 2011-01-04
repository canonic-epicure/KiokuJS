Class('KiokuJS.TypeMap.Date', {
    
    isa     : 'KiokuJS.TypeMap',
    
    does    : 'KiokuJS.TypeMap.Role.NoDeps',
    
    
    has : {
        forClass    : 'Date',
        intrinsic   : true
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Date'
        },
        
        
        collapse : function (node, collapser) {
            return node.object.getTime()
        },
        
        
        clearInstance : function (node) {
        },
        
        
        createEmptyInstance : function (node) {
            return new Date()
        },
        
        
        populate : function (node, expander) {
            var instance = node.object
            
            instance.setTime(node.data)
        }
    }

})
