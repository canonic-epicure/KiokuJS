Class('JiojuDB.LiveObjects.Scope', {
    
    
    has : {
        parent          : null,
        
        entries         : Joose.I.Object,
        
        objects         : Joose.I.Object
    },
    
        
    methods : {
        
        deriveChild : function () {
            return new this.constructor({
                parent      : this,
                
                entries     : Joose.O.getMutableCopy(this.entries),
                objects     : Joose.O.getMutableCopy(this.objects)
            })
        },
        
        
        objectToId : function (obj) {
            
            return this.objects[ obj.__ID__ ]
        },
        
        
        idToObject : function (id) {
            
            return this.objects[ id ]
        },
        
        
        idToEntry : function (id) {

            return this.entries[ id ]
        },
        
        
        store : function (entry) {
            var ID = entry.ID
            
            this.entries[ ID ] = entry
            this.objects[ ID ] = entry.object
        },
        
        
        remove : function () {
        }
    }

})


