Class('KiokuJS.Exception', {
    
    has : {
        nativeEx        : null,
        
        message         : { is : 'rw' },
        description     : 'Unknown exception'
    },
    
    
    methods : {
        
        toString : function () {
            return this.meta.name + ': ' + this.description + ', ' + this.getMessage()
        }
    }
})
