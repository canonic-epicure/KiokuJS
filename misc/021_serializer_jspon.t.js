StartTest(function(t) {
    
	t.plan(3)
    
    var async0 = t.beginAsync()
    
    use('KiokuJS.Serializer.JSPON', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Serializer.JSPON, "KiokuJS.Serializer.JSPON is here")

        var serializer = new KiokuJS.Serializer.JSPON()
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Objects with references')
        
        t.ok(serializer.serialize(new KiokuJS.Reference({ ID : 1 })) == '{"$ref":1}', 'Simple reference serialized ok')
        
        t.ok(serializer.serialize({
            
            foo : new KiokuJS.Reference({ ID : 2 }), 
            bar : [ new KiokuJS.Reference({ ID : 3 }), 'zab' ]
            
        }) == '{"foo":{"$ref":2},"bar":[{"$ref":3},"zab"]}', 'Nested references serialized ok')
        
        
        t.endAsync(async0)
    })
})    