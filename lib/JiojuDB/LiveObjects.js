Class('JiojuDB.LiveObjects', {
    
    use : 'JiojuDB.LiveObjects.Scope',
    
    
    has : {
        
//        scope           : {
//            init : function () { return new JiojuDB.LiveObjects.Scope() }
//        },
        
        entries         : Joose.I.Object
        
//        ,
//        
//        objects         : Joose.I.Object
    },
    
        
    methods : {
        
//        newScope    : function () {
//            this.scope = this.scope.deriveChild()
//        },
//        
//        
//        unnestScope : function () {
//            this.scope = this.scope.parent
//        },
        

//        objectToId : function (obj) {
//            
//            return this.objects[ obj.__ID__ ]
//        },
//        
//        
//        idToObject : function (id) {
//            
//            return this.objects[ id ]
//        },
//        
//        
//        idToEntry : function (id) {
//
//            return this.entries[ id ]
//        },
        
        
        store : function (entry) {
//            var ID = entry.ID
//            
//            if (!ID) throw "Can't save entry [" + entry + "] in LiveObjects - it hasn't 'ID'" 
//            
//            this.entries[ ID ] = entry
////            this.objects[ ID ] = entry.object
        }
        
//        ,
//        
//        
//        remove : function () {
//        }
        
//        ,
//        remove : function () {
//        }
    }

})


