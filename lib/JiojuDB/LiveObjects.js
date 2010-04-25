Class('JiojuDB.LiveObjects', {
    
    
    has : {
        
        scope           : {
            init : function () { return new JiojuDB.LiveObjects.Scope() }
        }
        
//        entries         : Joose.I.Object,
//        
//        objects         : Joose.I.Object
        
    },
    
        
    methods : {
        
        newScope    : function () {
            this.scope = this.scope.deriveChild()
        },
        
        
        unnestScope : function () {
            this.scope = this.scope.parent
        },
        

        objectToId : function (obj) {
            return this.scope.objectToId(obj)
        },
        
        
        idToObject : function (id) {
            return this.scope.idToObject(id)
        },
        
        
        idToEntry : function (id) {
            return this.scope.idToEntry(id)
        },
        
        
        store : function (entry) {
            this.scope.store(entry)
        }
        
//        ,
//        remove : function () {
//        }
    }

})


