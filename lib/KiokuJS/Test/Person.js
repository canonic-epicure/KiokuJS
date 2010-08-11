Class('KiokuJS.Test.Person', {
    
    has : {
        name    : null,
        
        self    : null,
        
        spouse  : {
            is  : 'rwc'
        },
        
        father  : null,
        mother  : null,
        
        children : Joose.I.Array,
        
        mood    : {
            is : 'rw'
        },
        
        task    : null
    },
    
    
    methods : {
        
        initialize : function () {
            this.self = this
        }
    }
})
