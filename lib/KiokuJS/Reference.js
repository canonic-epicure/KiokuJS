Class('KiokuJS.Reference', {
    
    has : {
        ID          : { required : true },
        
        type        : null
    },
    
    
    methods : {
        toString : function () {
            return '{"$ref":' + this.ID + '}'
        }
    }
    
})