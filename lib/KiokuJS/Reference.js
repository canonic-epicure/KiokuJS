Class('KiokuJS.Reference', {
    
    has : {
        ID          : { required : true }
    },
    
    
    methods : {
        toString : function () {
            return '{"$ref":' + this.ID + '}'
        }
    }
    
})