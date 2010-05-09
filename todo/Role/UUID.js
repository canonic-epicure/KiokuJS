Role('JiojuDB.Role.UUID', {
    
    use : [ 'Data.UUID' ],
    
    
    methods : {
        
        generateUUID   : function () {
            return Data.UUID.my.uuid()
        }
    }

})
