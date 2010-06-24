Class('KiokuJS', {
    
//    traits  : 'JooseX.CPS',
    
    
    use     : [ 'KiokuJS.Resolver', 'KiokuJS.Resolver.Standard', 'KiokuJS.Scope' ],
    
    
    has : {
        resolver            : null,
        backend             : null,
        
        root                : {
            is      : 'rwc',
            lazy    : 'this.buildRootScope'
        }
    },
    
        
    methods : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, containig the standard resolver as the lowest-priority
            this.resolver = new KiokuJS.Resolver( 
                (this.resolver ? [ this.resolver ] : []).concat( new KiokuJS.Resolver.Standard() )
            )
        },
        
        
        buildRootScope : function () {
            return new KiokuJS.Scope({
                backend     : this.backend,
                resolver    : this.resolver
            })
        },
        
        
        newScope    : function () {
            return this.root().deriveChild()
        }
    }
    
    

})


// XXX need to keep in sync with original `Joose.O.each`
Joose.O.each = function (object, func, scope) {
    scope = scope || this
    
    for (var i in object) 
        if (i != '__ID__' && i != '__REFADR__')
            if (func.call(scope, object[i], i) === false) return false
    
    if (Joose.is_IE) 
        return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}


Joose.O.isEmpty = function (object) {
    for (var i in object) if (object.hasOwnProperty(i) && i != '__ID__' && i != '__REFADR__') return false
    
    return true
}
