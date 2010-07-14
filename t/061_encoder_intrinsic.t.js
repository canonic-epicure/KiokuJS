StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Test.ValueWrapper', 'KiokuJS.Test.TypeMap.ValueWrapper' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,                   "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,         "'KiokuJS.Collapser' is here")
        t.ok(KiokuJS.Test.ValueWrapper, "'KiokuJS.Test.ValueWrapper' is here")


        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var value = new KiokuJS.Test.ValueWrapper({ value : 'someValue' })
        
        var array = [ value, value ]
        
        var graph = {
            data1 : value,
            data2 : array
        }
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash({
            resolver            : new KiokuJS.Resolver.Standard([
                {
                    meta : 'KiokuJS.Test.TypeMap.ValueWrapper'
                }
            ])
        })
        
        var scope       = new KiokuJS.Scope({
            backend     : backend
        })
        
        var collapser = new KiokuJS.Collapser({
            scope       : scope
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ graph, array ])
        
        t.ok(nodes.length == 2, 'Correct number of nodes is returned')
        
        Joose.A.each(nodes, scope.pinNode, scope)
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setting up nodes & entries')
        
        var graphNode           = scope.objectToNode(graph)
        var graphEntry          = backend.encode(graphNode.getEntry())
        var graphData           = graphEntry.data
        
        var arrayNode           = scope.objectToNode(array)
        var arrayEntry          = backend.encode(arrayNode.getEntry())
        var arrayData           = arrayEntry.data
        
        
        t.ok(graphNode.isRoot, '`graphNode` is in the root objects set')
        t.ok(arrayNode.isRoot, '`arrayNode` is in the root objects set')
        
        t.ok(graphEntry.$entry, "graphEntry is marked with $entry")
        t.ok(arrayEntry.$entry, "arrayEntry is marked with $entry")
        
        
        var valueEntry1   = graphData.data1
        var valueEntry2   = arrayData[0]
        var valueEntry3   = arrayData[1]
        
        t.ok(valueEntry1 != valueEntry2 && valueEntry2 == valueEntry3, 'Value entries are shared among the call to `encode`')
        
        t.ok(valueEntry1.data.value == 'someValue', '`valueEntry1` has correct value')
        t.ok(valueEntry2.data.value == 'someValue', '`valueEntry2` has correct value')
        t.ok(valueEntry3.data.value == 'someValue', '`valueEntry3` has correct value')
        
        t.ok(valueEntry1.$entry, '`valueEntry1` is marked with $entry')
        t.ok(valueEntry2.$entry, '`valueEntry2` is marked with $entry')
        t.ok(valueEntry3.$entry, '`valueEntry3` is marked with $entry')
        
        t.done()
        
        t.endAsync(async0)
    })
})    
