Class('KiokuJS.Exception', {
    
    has : {
        object      : null,
        
        description : null
    },
    
    
    methods : {
        
        toString : function () {
            return this.meta.name + ': ' + this.description
        }
        
    }
})
