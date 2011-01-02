Class('KiokuJS.Test.Fixture', {
    
    use     : 'KiokuJS.Backend.Role.SkipFixture',
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        connect                 : { required : true },
        cleanup                 : null,
        
        skipCleanup             : false,
        
        t                       : { required : true },
        
        requiredBackendRoles    : Joose.I.Array,
        
        sort                    : 1
    },
    
        
    methods : {
        
        checkSkipReason : function (handle) {
            
            var backend = handle
            
            if (backend.meta.does(KiokuJS.Backend.Role.SkipFixture)) {
                var shouldSkip = backend.skipFixtures()
                
                if (Joose.A.exists(shouldSkip, this.meta.name)) return "Backend [" + backend + "] doesn't support functionality from the [" + this + "]"
            }
            
            var notImplementedRole 
            
            Joose.A.each(this.requiredBackendRoles, function (requiredRole) {
                requiredRole = eval(requiredRole)
                
                if (typeof requiredRole != 'function' || !requiredRole.meta) throw "Unknown value used for required backend role: [" + requiredRole + "], fixture [" + this + "]"
                
                if (!backend.meta.does(requiredRole)) {
                    notImplementedRole = requiredRole
                    
                    return false
                }
            }, this)
            
            if (notImplementedRole) return "Backend [" + backend + "] don't implement the role [" + notImplementedRole.meta.name + "], required for fixture [" + this + "]"
        }
        
    },
    
    
    continued : {
        
        methods : {
            
            run : function () {
                this.createHandler().andThen(function (handle) {
                    var t               = this.t
                    
                    this.TRY(function () {
                        
                        var skipReason      = this.checkSkipReason(handle)
                        
                        if (skipReason) {
                            t.skip(skipReason)
                            
                            this.cleanupHandler(handle, t).now()
                            
                            return
                        }
                    
                        this.populate(handle, t)
                            
                        this.verify(handle, t)
                                
                        this.cleanupHandler(handle, t).now()
                            
                    }).CATCH(function (e) {
                            
                        t.fail('Exception [' + (e.description || e.message) + '] caught when running fixture: [' + this + ']')
                        
                        this.CONTINUE()
                            
                    }).now()
                })
            },
            
        
            populate : function (handle, t) {
                this.CONTINUE()
            },
            
            
            verify : function (handle, t) {
                this.CONTINUE()
            },
            
            
            createHandler : function () {
                var connect = this.connect
                
                this.TRY(connect, this).now()
            },
            
            
            cleanupHandler : function (handle, t) {
                var cleanup = this.cleanup
                
                if (cleanup && !this.skipCleanup) 
                    this.TRY(cleanup, this, [ handle, t ]).now()
                else
                    this.CONTINUE()
            }
        }
    }

})

