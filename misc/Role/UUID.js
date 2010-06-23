Role('KiokuJS.Role.UUID', {
    
    use : [ 'Data.UUID' ],
    
    
    methods : {
        
        generateUUID   : function () {
            return Data.UUID.my.uuid()
        }
    }

})
