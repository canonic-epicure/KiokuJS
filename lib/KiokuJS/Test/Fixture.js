Class('KiokuJS.Test.Fixture', {
    
    use     : 'KiokuJS.Backend.Role.SkipFixture',
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        init                    : { required : true },
        
        t                       : { required : true },
        
        requiredBackendRoles    : Joose.I.Array,
        
        sort                    : 1
    },
    
        
    methods : {
        
        checkSkipReason : function (handle) {
            
            var backend = handle.backend
            
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
                var handle      = this.init()
                var t           = this.t
                
                var skipReason      = this.checkSkipReason(handle)
                
                if (skipReason) {
                    t.skip(skipReason)
                    t.done()
                    
                    this.CONTINUE()
                }

                
                this.TRY(function () {
                
                    this.populate(handle, t).andThen(function () {
                        
                        this.verify(handle, t).andThen(function () {
                            
                            this.cleanup(handle, t).now()
                        })
                    })
                        
                }).CATCH(function (e) {
                        
                    t.fail('Exception [' + e + '] caught when running fixture: [' + this + ']')
                    
                    this.CONTINUE()
                        
                }).now()
            },
        
        
            populate : function (handle, t) {
                throw "Abstract method `populate` of `KiokuJS.Test.Fixture` reached"
            },
            
            
            verify : function (handle, t) {
                throw "Abstract method `verify` of `KiokuJS.Test.Fixture` reached"
            },
            
            
            cleanup : function (handle, t) {
                throw "Abstract method `cleanup` of `KiokuJS.Test.Fixture` reached"
            }
        }
    }

})

