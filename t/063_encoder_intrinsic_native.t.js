StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Collapser setup')
    
    var backend     = new KiokuJS.Backend.Hash({
        resolver            : new KiokuJS.Resolver.Standard()
    })
    
    var scope       = new KiokuJS.Scope({
        backend     : backend
    })
    
    var collapser = new KiokuJS.Collapser({
        scope       : scope
    })
    
    t.ok(collapser, "KiokuJS collapser was instantiated")
        
        
    //======================================================================================================================================================================================================================================================
    t.diag('Graph setup')
    
    var instance = {
        
        data1   : [ 1, 2, 3 ],
        data2   : [ 'foo', 'bar' ],
        data3   : {
            foo : 'baz'
        }
    }
    
        
    //======================================================================================================================================================================================================================================================
    t.diag('Collapsing')

    var nodes = collapser.collapse({}, [ instance ])
    
    t.ok(nodes.length == 1, 'Correct number of nodes was returned')
        
    Joose.A.each(nodes, scope.pinNode, scope)
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setting up nodes & entries')
    
    var instanceNode           = scope.objectToNode(instance)
    var instanceEntry          = backend.encodeNode(instanceNode)
    var instanceData           = instanceEntry.data
        
    
    t.ok(instanceEntry.$entry, "Instance entry is marked with $entry")
    
    t.ok(instanceData.data1 instanceof Array, 'Correctly encoded non-first class native array #1')
    t.ok(instanceData.data2 instanceof Array, 'Correctly encoded non-first class native array #2')
    t.ok(instanceData.data3 instanceof Object, 'Correctly encoded non-first class native object')
    
    var data1 = instanceData.data1
    
    t.ok(data1[ 0 ] == 1 && data1[ 1 ] == 2 && data1[ 2 ] == 3, 'Correct content for `data1`')

    
    
    var data2 = instanceData.data2
    
    t.ok(data2[ 0 ] == 'foo' && data2[ 1 ] == 'bar', 'Correct content for `data2`')
    
    
    var data3 = instanceData.data3
    
    t.ok(data3.foo == 'baz', 'Correct content for `data3`')
    
    
    t.done()
})    