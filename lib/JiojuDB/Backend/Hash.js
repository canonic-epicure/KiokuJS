Class('JiojuDB.Backend.Hash', {
    
    isa   : 'JiojuDB.Backend',
    
    
    has : {
        entries         : Joose.I.Object
    },
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet) {
                var entries = this.entries
                
                return Joose.A.map(idsToGet, function (id) {
                    return entries[ id ]
                })
            },
            
            
            insert  : function (entriesToInsert) {
                var entries         = this.entries
                var serializer      = this.serializer
                
                Joose.A.each(entriesToInsert, function (entry) {
                    entries[ entry.id ] = serializer.serialize(entry)
                })
            },
            
            
            remove  : function (idsToRemove) {
                var entries = this.entries
                
                Joose.A.each(idsToRemove, function (id) {
                    delete entries[ id ]
                })
            },
            
            
            exists  : function (idsToCheck) {
                var entries = this.entries
                
                return Joose.A.map(idsToCheck, function (id) {
                    return entries[ id ] != null
                })
            }
        }
    }

})
