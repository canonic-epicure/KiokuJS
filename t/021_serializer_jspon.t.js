StartTest(function(t) {
    
	t.plan(3)
    
    var async0 = t.beginAsync()
    
    use('JiojuDB.Serializer.JSPON', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JiojuDB.Serializer.JSPON, "JiojuDB.Serializer.JSPON is here")

        var serializer = new JiojuDB.Serializer.JSPON()
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Objects with references')
        
        t.ok(serializer.serialize(new JiojuDB.Reference({ ID : 1})) == '{"$ref":1}', 'Simple reference serialized ok')
        
        t.ok(serializer.serialize({
            
            foo : new JiojuDB.Reference({ ID : 2}), 
            bar : [ new JiojuDB.Reference({ ID : 3}), 'zab' ]
            
        }) == '{"foo":{"$ref":2},"bar":[{"$ref":3},"zab"]}', 'Nested references serialized ok')
        
        
        t.endAsync(async0)
    })
})    