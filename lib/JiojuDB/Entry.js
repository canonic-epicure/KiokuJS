Class('JiojuDB.Entry', {
    
    
    has : {
        id              : {
            is  : 'rw'
        },
        
        
        previous        : null,
        
        data            : null,
        
        deleted         : false,
        
        className       : null,
        traits          : null,
        classVersion    : null,
        
        backendData     : null,
        
        object          : null,
        
        references      : Joose.I.Array
    },
    
        
    methods : {
        
        derive : function (config) {
            var clone = this.clone(config || {})
            
            clone.previous = this
            
            return clone
        }
    }

})


