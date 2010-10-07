Class('KiokuJS.Exception.LookUp', {
    
    isa     : 'KiokuJS.Exception',
    
    has : {
        id          : { required : true },
        backendName : { required : true },
        
        description : 'Failed lookup attempt'
    },
    
    methods : {
        
        getMesage : function () {
            return 'ID [' + this.id + '] not found in the backend [' + this.backendName + ']'
        }
    }
})
