Role('KiokuJS.Feature.Class.OwnUUID', {
    
    use         : 'Data.UUID',
    
    does        : 'KiokuJS.Feature.Class.OwnID',
    
    
    has : {
        uuid    : {
            is      : 'rw',
            init    : function () { return Data.UUID.uuid() }
        }
    },
    
    
    methods : {
        
        acquireID : function () {
            return this.getUuid()
        }
    }
})
