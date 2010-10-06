Class('KiokuJS.Backend.Hash', {
    
    isa   : 'KiokuJS.Backend',
    
    
    has : {
        docs         : Joose.I.Object
    },
    
    
    does    : [ 'KiokuJS.Backend.Feature.Overwrite', 'KiokuJS.Backend.Feature.Update' ],
    
    
    use     : [ 'KiokuJS.Exception.Overwrite', 'KiokuJS.Exception.Update' ],
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet, mode) {
                var docs = this.docs
                
                var strings = Joose.A.map(idsToGet, function (id) {
                    
                    if (docs[ id ]) return docs[ id ]
                    
                    throw new KiokuJS.Exception.LookUp({ id : id, backend : this }) 
                })
                
                var entries     = this.deserialize(strings)
                
                var CONTINUE    = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(entries)
                }, 0)
            },
            
            
            insert  : function (entries, mode) {
                var docs        = this.docs
                var strings     = this.serialize(entries)
                
                var ids = Joose.A.map(entries, function (entry, index) {
                    
                    var ID  = entry.ID
                    
                    if (mode == 'insert' && docs[ ID ]) 
                        throw new KiokuJS.Exception.Overwrite({
                            id          : ID,
                            oldValue    : docs[ ID ],
                            newValue    : strings[ index ]
                        })
                    
                    if (mode == 'update' && !docs[ ID ]) 
                        throw new KiokuJS.Exception.Update({
                            message : "Attempt to update entry with ID = [" + ID + "], value = [" + strings[ index ] + "], but no such entry in storage"
                        })
                        
                        
                    docs[ ID ] = strings[ index ]
                    
                    return ID
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(ids)
                }, 0)
            },
            
            
            remove  : function (idsToRemove) {
                var docs = this.docs
                
                Joose.A.each(idsToRemove, function (id) {
                    
                    if (id == Object(id)) id = id.ID
                    
                    delete docs[ id ]
                })
                
                setTimeout(this.getCONTINUE(), 0)
            },
            
            
            exists  : function (idsToCheck) {
                var docs = this.docs
                
                var checks = Joose.A.map(idsToCheck, function (id) {
                    return docs[ id ] != null
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(checks)
                }, 0)
                
            }
        }
    }

})
