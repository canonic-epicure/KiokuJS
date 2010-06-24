Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        scope           : { required : true },
        
        entries         : Joose.I.Object
    },
    
        
    methods : {
        
        pinEntry : function (entry) {
            this.entries[ entry.ID ] = entry
        },
        
        
        idPinned : function (id) {
            return this.entries[ id ] != null || this.scope.idPinned(id)
        },
        
        
        animateEntry : function (entry) {
        }
    },
    
    
    continued : {
        
        methods : {
            
            // at this point entry should have classes fetched
            materialize : function (ids) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                var outliner    = backend.outliner
                var resolver    = scope.getResolver()
                
                backend.get(ids).then(function (entries) {
                    
                    Joose.A.each(entries, me.pinEntry, me)
                    
                    var notFetchedIds = []
                    
                    Joose.A.each(outliner.gatherReferences(entries), function (refID) {
                        if (!me.idPinned(refID)) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds).now()
                    else {
                        Joose.A.each(me.entries, me.animateEntry, me)
                        
                        this.CONTINUE()
                    }
                })
            },
            
            
            prefetchClasses : function (entries) {
                // gathering classes of the entries, which needs to be loaded
                var classDescriptors = Joose.A.map(entries, function (entry) {
                    
                    if (entry.classVersion) return { type : 'joose', token : entry.className, version : entry.classVersion }
                    
                    return entry.className
                })
                
                use(classDescriptors, this.getCONTINUE())
            },
            
            
            link : function (ids) {
                // fetching resolver's classes (in case it has been mutated)
                this.scope.getResolver().fetchClasses().then(function () {
                    
                    this.materialize(ids).now()
                    
                }, this).now()
            }
        }
    }
    

})


