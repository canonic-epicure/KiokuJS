Class('KiokuJS.Exception.Overwrite', {
    
    isa     : 'KiokuJS.Exception',
    
    has : {
        id          : { required : true },
        oldValue    : '',
        newValue    : '',
        
        description : 'Overwrite attempt occured'
    },
    
    methods : {
        
        getMesage : function () {
            return "Attempt to overwrite entry with ID = [" + this.id + "], value = [" + this.oldValue + "], with [" + this.newValue + "]"
        }
    }
})
