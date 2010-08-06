Class('KiokuJS.Exception', {
    
    has : {
        nativeEx        : null,
        
        message         : null,
        description     : 'Unknown exception'
    },
    
    
    methods : {
        
        toString : function () {
            return this.meta.name + ': ' + this.description + ', ' + this.message
        }
    }
})
