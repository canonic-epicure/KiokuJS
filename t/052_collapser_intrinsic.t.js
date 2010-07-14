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
        var graphData           = graphNode.data
        
        var arrayNode           = scope.objectToNode(array)
        var arrayData           = arrayNode.data
        
        
        t.ok(graphNode.isRoot, '`graphNode` is in the root objects set')
        t.ok(arrayNode.isRoot, '`arrayNode` is in the root objects set')
        
        
        var valueNode1   = graphNode.data.data1
        var valueNode2   = arrayNode.data[0]
        var valueNode3   = arrayNode.data[1]
        
        t.ok(valueNode1 === valueNode2 && valueNode2 === valueNode3, 'All three value nodes are shared')
        
        t.ok(!valueNode1.isFirstClass(), '`valueNode1` is not first class')
        
        
        t.done()
        
        t.endAsync(async0)
    })
})    
