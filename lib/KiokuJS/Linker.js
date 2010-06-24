Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        scope           : { required : true },
        
        entries         : Joose.I.Object
    },
    
        
    methods : {
        
        pinEntry : function (serializedEntry) {
            var entry = this.scope.getBackend().serializer.deserialize(serializedEntry)
            
            return this.entries[ entry.ID ] = entry
        },
        
        
        idPinned : function (id) {
            return this.entries[ id ] != null || this.scope.idPinned(id)
        },
        
        
        animateEntry : function (entry) {
            var typeMap = this.getTypeMapFor(entry.className)
            
            var instance = typeMap.expand(entry, this)
        },
        

        // XXX add resolver role with this method and 'resolver' attribute?
        getTypeMapFor : function (className) {
            var typeMap = this.scope.getResolver().resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
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
                
                backend.get(ids).then(function (serializedEntries) {
                    
                    var deserializedEntries = Joose.A.each(serializedEntries, me.pinEntry, me)
                    
                    var notFetchedIds = []
                    
                    Joose.A.each(outliner.gatherReferences(deserializedEntries), function (refID) {
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


