Class('KiokuJS.Backend.Hash', {
    
    isa   : 'KiokuJS.Backend',
    
    
    has : {
        docs         : Joose.I.Object
    },
    
    
    does    : [ 'KiokuJS.Backend.Feature.Overwrite', 'KiokuJS.Backend.Feature.Update' ],
    
    
    use     : [ 'KiokuJS.Exception.Overwrite', 'KiokuJS.Exception.Update' ],
    
        
    continued : {
        
        methods : {
            
            getEntry  : function (id) {
                var docs        = this.docs
                var me          = this
                var CONTINUE    = this.getCONTINUE()
                    
                if (docs[ id ])
                    setTimeout(function () {
                        
                        CONTINUE(me.deserialize(docs[ id ]))
                    }, 0)
                else
                    throw new KiokuJS.Exception.LookUp({ id : id, backendName : this.meta.name })
            },
            
            
            insertEntry  : function (entry, mode) {
                var docs        = this.docs
                
                var string      = this.serialize(entry)
                
                var ID  = entry.ID
                
                if (mode == 'insert' && docs[ ID ]) 
                    throw new KiokuJS.Exception.Overwrite({
                        id          : ID,
                        oldValue    : docs[ ID ],
                        newValue    : string
                    })
                
                if (mode == 'update' && !docs[ ID ]) 
                    throw new KiokuJS.Exception.Update({
                        message : "Attempt to update entry with ID = [" + ID + "], value = [" + string + "], but no such entry in storage"
                    })
                    
                    
                docs[ ID ] = string
                
                setTimeout(this.getCONTINUE(), 0)
            },
            
            
            removeID  : function (id) {
                var docs = this.docs
                
                delete docs[ id ]
                
                setTimeout(this.getCONTINUE(), 0)
            },
            
            
            removeEntry  : function (entry) {
                var docs = this.docs
                
                delete docs[ entry.ID ]
                
                setTimeout(this.getCONTINUE(), 0)
            },
            
            
            existsID  : function (id) {
                var docs        = this.docs
                var CONTINUE    = this.getCONTINUE()
                    
                setTimeout(function () {
                    
                    CONTINUE(docs[ id ] != null)
                }, 0)
            }
        }
    }

})
