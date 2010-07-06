StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
//    t.plan(11)
    
    use([ 'KiokuJS.Resolver.Standard', 'KiokuJS.Test.TypeMap.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Resolver.Standard, "KiokuJS.Resolver.Standard is here")
        t.ok(KiokuJS.Test.TypeMap.Person, "KiokuJS.Test.TypeMap.Person is here")
        
        
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
        
        
        t.ok(typeof KiokuJS.Test.Person == 'undefined', "Class 'KiokuJS.Test.Person' isn't loaded yet")
        
        resolver = new KiokuJS.Resolver.Standard([
            {
                meta : KiokuJS.Test.TypeMap.Person
            }
        ])
        
        resolver.resolve([ 'KiokuJS.Test.Person' ]).then(function (res) {
            
            t.ok(KiokuJS.Test.Person, "Class 'KiokuJS.Test.Person' was loaded")
            
            t.ok(res[0] instanceof KiokuJS.Test.TypeMap.Person, 'Correct typeMap resolved #5')
            
            
            //======================================================================================================================================================================================================================================================
            t.diag('TypeMap inheritance')
            
            
            Class('KiokuJS.Test.Person.Tidy', { 
                isa : KiokuJS.Test.Person 
            })
            

            t.ok(resolver.resolveSingle('KiokuJS.Test.Person.Tidy') == res[0], "TypeMap for 'KiokuJS.Test.Person' handles subclasses also")
            
            
            t.endAsync(async0)
            
            t.done()
            
        }).now()
    })
})    