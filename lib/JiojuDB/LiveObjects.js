Class('JiojuDB.LiveObjects', {
    
    
    has : {
        
        entries         : Joose.I.Object,
        
        objects         : Joose.I.Object
        
    },
    
        
    methods : {
        
        objectToId : function (obj) {
            
            return this.objects[ obj.__ID__ ]
        },
        
        
        idToObject : function (id) {
            
            return this.objects[ id ]
        },
        
        
        idToEntry : function (id) {

            return this.entries[ id ]
        },
        
        
        insert : function () {
            Joose.A.each(arguments, function () {
                
            })
        },
        
        
        remove : function () {
            Joose.A.each(arguments, function () {
                
            })
        }
    }

})


