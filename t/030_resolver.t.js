StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Resolver.Standard, "KiokuJS.Resolver.Standard is here")
        t.ok(KiokuJS.Test.TypeMap.ValueWrapper, "KiokuJS.Test.TypeMap.ValueWrapper is here")
        
        
        var resolver = new KiokuJS.Resolver.Standard()
        
        t.ok(resolver, "KiokuJS.Resolver.Standard was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Array')
        
        var arrayTypeMap = resolver.resolveSingle('Array')
        
        t.ok(arrayTypeMap instanceof KiokuJS.TypeMap.Array, 'Correct typeMap resolved #1')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Object')
        
        var objectTypeMap = resolver.resolveSingle('Object')
        
        t.ok(objectTypeMap instanceof KiokuJS.TypeMap.Object, 'Correct typeMap resolved #2')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Joose + typeMap inheritance')
        
        Class('Some.Class')
        Class('Another.Class')
        
        var objectTypeMap = resolver.resolveSingle('Some.Class')
        
        t.ok(objectTypeMap instanceof KiokuJS.TypeMap.Joose, 'Correct typeMap resolved #3')

        
        var objectTypeMap = resolver.resolveSingle('Another.Class')
        
        t.ok(objectTypeMap instanceof KiokuJS.TypeMap.Joose, 'Correct typeMap resolved #4')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Dependencies loading')
        
        
        t.ok(typeof KiokuJS.Test.ValueWrapper == 'undefined', "Class 'KiokuJS.Test.ValueWrapper' isn't loaded yet")
        
        resolver = new KiokuJS.Resolver.Standard([
            {
                meta : KiokuJS.Test.TypeMap.ValueWrapper
            }
        ])
        
        resolver.resolve([ 'KiokuJS.Test.ValueWrapper' ]).andThen(function (res) {
            
            t.ok(KiokuJS.Test.ValueWrapper, "Class 'KiokuJS.Test.ValueWrapper' was loaded")
            
            t.ok(res[0] instanceof KiokuJS.Test.TypeMap.ValueWrapper, 'Correct typeMap resolved #5')
            
            
            //======================================================================================================================================================================================================================================================
            t.diag('TypeMap inheritance')
            
            
            Class('KiokuJS.Test.ValueWrapper.Sub', { 
                isa : KiokuJS.Test.ValueWrapper 
            })
            

            t.ok(resolver.resolveSingle('KiokuJS.Test.ValueWrapper.Sub') == res[0], "TypeMap for 'KiokuJS.Test.ValueWrapper' handles subclasses also")
            
            
            t.endAsync(async0)
            
            t.done()
            
        })
    })
})    