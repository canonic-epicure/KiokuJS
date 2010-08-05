Class('KiokuJS.Exception', {
    
    has : {
        nativeEx        : null,
        
        message         : null,
        description     : null
    },
    
    
    methods : {
        
        toString : function () {
            return this.meta.name + ': ' + this.description
        }
    }
})
