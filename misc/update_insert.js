
            
            update : function () {
                var objects   = Array.prototype.slice.call(arguments)
                var self      = this
                
                Joose.A.each(objects, function (object) {
                    if (!self.objectPinned(object)) throw "Can't update object [" + object + "] - its not in scope"
                })
                
                this.storeObjects({}, objects, 'update').now()
            },
            
            
            insert : function () {
                var objects = Array.prototype.slice.call(arguments)
                
                objects.unshift({})
                
                this.insertAs.apply(this, objects).now()
            },
            
            
            insertAs : function () {
                var objectsWithOutIDs   = Array.prototype.slice.call(arguments)
                var objectsWithIDs      = objectsWithOutIDs.shift()
                var self                = this
                
                Joose.A.each(objectsWithOutIDs, function (object) {
                    if (self.objectPinned(object)) throw "Can't insert object [" + object + "] - its already in scope"
                })
                
                Joose.O.each(objectsWithIDs, function (object) {
                    if (self.objectPinned(object)) throw "Can't insert object [" + object + "] - its already in scope"
                })
                
                this.storeObjects(objectsWithIDs, objectsWithOutIDs, 'insert').now()
            },
            
            