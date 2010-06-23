StartTest(function(t) {
    
    t.plan(11)
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Resolver.Standard', 'TypeMap.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Resolver.Standard, "KiokuJS.Resolver.Standard is here")
        t.ok(TypeMap.Person, "TypeMap.Person is here")
        
        
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
        
        
        t.ok(typeof Person == 'undefined', "Class 'Person' isn't loaded yet")
        
        resolver = new KiokuJS.Resolver.Standard([
            {
                meta : TypeMap.Person
            }
        ])
        
        resolver.resolve([ 'Person' ]).then(function (res) {
            
            t.ok(Person, "Class 'Person' was loaded")
            
            t.ok(res[0] instanceof TypeMap.Person, 'Correct typeMap resolved #5')
            
            
            //======================================================================================================================================================================================================================================================
            t.diag('TypeMap inheritance')
            
            
            Class('Person.Tidy', { 
                isa : Person 
            })
            

            t.ok(resolver.resolveSingle('Person.Tidy') == res[0], "TypeMap for 'Person' handles subclasses also")
            
            
            t.endAsync(async0)    
        }).now()
    })
})    